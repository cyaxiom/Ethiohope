import { profileDetails, sampleQuestions, sampleTags } from './mock.data';
import { answers } from './mock.data';

//success response structure
const successResponse = (
  data,
  message = 'data fetched successfully',
  code = 200
) => ({
  success: true,
  message: message,
  data,
  code,
});
//error response structure
const errorResponse = (message = 'An error occurred', code = 500) => ({
  success: false,
  message: message,
  code,
});

export async function fetchQuestions(tag) {
  // Simulate an API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredQuestions = sampleQuestions.filter((q) => {
        // if New: in descending order of created_at
        if (tag === 'New') {
          return true;
        } else {
          return q.status === tag;
        }
      });
      if (tag === 'New') {
        filteredQuestions.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }
      resolve(filteredQuestions);
    }, 500);
  });
}

export async function fetchQuestionById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const question = sampleQuestions.find((q) => q.id === parseInt(id));
      if (question) {
        resolve(question);
      } else {
        reject(new Error('Question not found'));
      }
    }, 500);
  });
}
export async function upvoteQuestion(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const questionIndex = sampleQuestions.findIndex(
        (q) => q.id === parseInt(id)
      );
      if (questionIndex !== -1) {
        sampleQuestions[questionIndex].votes += 1;
        resolve(successResponse(sampleQuestions[questionIndex]));
      } else {
        reject(errorResponse('Question not found'));
      }
    }, 300);
  });
}

export async function fetchAnswersByQuestionId(
  questionId,
  limit = 3,
  page = 1
) {
  // Simulate fetching answers for a question

  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredAnswers = answers.filter(
        (a) => a.question_id === parseInt(questionId)
      );
      // Sort answers by created_at descending
      filteredAnswers.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      if (limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const metadata = { total: filteredAnswers.length, page, limit };
        console.log('Metadata:', metadata);
        const response = {
          data: filteredAnswers.slice(startIndex, endIndex),
          metadata,
        };
        resolve(response);
      } else {
        resolve({ data: filteredAnswers });
      }
    }, 500);
  });
}

export async function postAnswer(questionId, answerData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const question = sampleQuestions.find(
        (q) => q.id === parseInt(questionId)
      );
      if (question) {
        const newAnswer = {
          id: answers.length + 1,
          author: 'Jane Doe',
          profile_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          content: answerData.content,
          created_at: new Date(),
          votes: 0,
          question_id: question.id,
        };
        answers.push(newAnswer);
        resolve(successResponse(newAnswer));
      } else {
        reject(errorResponse('Question not found'));
      }
    }, 300);
  });
}

export async function getTags(search, sort) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredTags = sampleTags
        .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
          if (sort === 'popular') return b.questions - a.questions;
          if (sort === 'newest') return b.followers - a.followers; // just demo
          if (sort === 'alpha') return a.name.localeCompare(b.name);
        });
      resolve(successResponse(filteredTags));
    }, 300);
  });
}

export async function getProfileDetails(userId) {
  // Simulate fetching user profile details
  return new Promise((resolve) => {
    setTimeout(() => {
      const profileDetail = profileDetails.find((p) => p.id === userId);
      resolve(successResponse(profileDetail));
    }, 500);
  });
}
