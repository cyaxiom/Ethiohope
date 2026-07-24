import { connect, disconnect, Types } from 'mongoose';
import { dbConnection } from '../core/config/database';
import { MessageModel } from '../modules/Chat/message.model';
import { ConversationModel } from '../modules/Chat/chat.model';
import { User } from '../modules/User/user.schema';
import { ChildModel } from '../modules/Child/child.model';
import { ProgramModel } from '../modules/Programs/program.model';

const simulate = async () => {
  try {
    console.log('Connecting to database...');
    // @ts-ignore
    await connect(dbConnection.url, dbConnection.options);
    console.log('Connected to DB');

    // 1. Ensure a Program and Announcement Group exist
    let program = await ProgramModel.findOne();
    if (!program) {
      console.log('No Program found, creating a dummy one...');
      program = await ProgramModel.create({
        title: "Summer Coding Intensive",
        description: "A 12-week deep dive into Fullstack development.",
        isActive: true
      });
    }

    let announcementGroup = await ConversationModel.findOne({ type: 'PROGRAM_GROUP' });
    if (!announcementGroup) {
      console.log('No PROGRAM_GROUP found, creating one...');
      announcementGroup = await ConversationModel.create({
        type: 'PROGRAM_GROUP',
        name: `${program.title} Announcements`,
        programId: program._id,
        isActive: true
      });
    }

    // 2. Ensure a base announcement message exists
    let announcement = await MessageModel.findOne({ 
      conversationId: announcementGroup._id,
      replyTo: { $exists: false } 
    }).sort({ createdAt: -1 });

    if (!announcement) {
      console.log('No base announcement found, creating one...');
      const admin = await User.findOne();
      announcement = await MessageModel.create({
        conversationId: announcementGroup._id,
        senderId: admin?._id || new Types.ObjectId(),
        text: "🚀 Welcome to the program! We start our first session this Monday at 9:00 AM. Please make sure to download the required software beforehand.",
        type: 'text'
      });
    }

    console.log(`Targeting Announcement: "${announcement.text.substring(0, 50)}..."`);

    // 3. Ensure we have Children to simulate
    let children = await ChildModel.find().limit(5);
    if (children.length === 0) {
      console.log('No children found, creating dummy student profiles...');
      const parent = await User.findOne();
      if (!parent) throw new Error("No parent user found to link children to");
      
      const dummyChildren = [
        { firstname: "Abebe", lastname: "Bikila", username: "abebe_s", gender: "male" },
        { firstname: "Sara", lastname: "Kebede", username: "sara_k", gender: "female" },
        { firstname: "Yohannes", lastname: "Tesfaye", username: "yoh_t", gender: "male" },
        { firstname: "Hana", lastname: "Mulugeta", username: "hana_m", gender: "female" },
        { firstname: "Dawit", lastname: "Haile", username: "dawit_h", gender: "male" }
      ];

      for (const d of dummyChildren) {
        const c = await ChildModel.create({
          ...d,
          parent: parent._id,
          birthdate: new Date(2010, 5, 12),
          grade: "7",
          pin: "1234",
          status: "active"
        });
        children.push(c);
      }
    }

    const emojis = ['👍', '❤️', '👏', '🔥', '🤩', '🙌'];
    const replies = [
      "Thank you for the update! This is very helpful.",
      "Clear, thanks! Looking forward to the session. 🙌",
      "Got it! Thanks for the info.",
      "I have a quick question: will the recording be available later?",
      "Clear, thank you!",
      "Awesome news, thanks team! 🔥",
      "Is there any prerequisite for the first week?",
      "Can't wait to start! ❤️",
      "Thanks for the clarification.",
      "Will this be a live session or a recording? 🤔"
    ];

    for (const child of children) {
      console.log(`Processing student: ${child.firstname} ${child.lastname}`);
      
      // --- Reaction ---
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      let reactions = announcement.reactions || [];
      const hasReacted = reactions.some(r => r.users.some(u => u.toString() === child._id.toString()));
      
      if (!hasReacted) {
        let reactionIdx = reactions.findIndex(r => r.emoji === randomEmoji);
        if (reactionIdx > -1) {
          reactions[reactionIdx].users.push(child._id as any);
        } else {
          reactions.push({ emoji: randomEmoji, users: [child._id as any] });
        }
        await MessageModel.updateOne(
          { _id: announcement._id },
          { $set: { reactions: reactions } }
        );
        console.log(`   - Reacted with: ${randomEmoji}`);
      }

      // --- Reply ---
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      await MessageModel.create({
        conversationId: announcementGroup._id,
        childId: child._id,
        text: randomReply,
        type: 'text',
        replyTo: announcement._id
      });
      console.log(`   - Replied: "${randomReply}"`);
    }

    console.log('\nSimulation successfully completed! Interaction data is now live.');
    await disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('\nSimulation failed:', error.message);
    process.exit(1);
  }
};

simulate();
