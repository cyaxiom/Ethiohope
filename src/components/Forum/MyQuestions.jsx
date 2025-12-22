import { Image, Send, MoreVertical, Clock, Flame } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { sampleQuestions } from '../../api/forum/mock.data';
import { QuestionCard } from './Questions';
const MyQuestions = () => {
  const [categories, setCategories] = React.useState([
    { id: 1, name: 'General' },
    { id: 2, name: 'Programming' },
    { id: 3, name: 'Community' },
    { id: 4, name: 'Web Development' },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTag, setActiveTag] = React.useState('New');
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [searchParams] = useSearchParams();
  const [tags, setTags] = React.useState([]);
  const type = searchParams.get('type');
  const questionId = searchParams.get('id');

  React.useEffect(() => {
    if (type === 'edit' && questionId) {
      // Fetch question details based on the id
      const fetchQuestion = async () => {
        setIsLoading(true);
        // Simulate fetching question by ID
        const fetchedQuestion = sampleQuestions.find(
          (q) => q.id === parseInt(questionId)
        );
        if (fetchedQuestion) {
          setSelectedCategory(fetchedQuestion.category);
          setTitle(fetchedQuestion.title);
          setDescription(fetchedQuestion.description);
          setTags(fetchedQuestion.tags || []);
          // Simulate image fetch
          setImage('');
          setImageName('');
        }
        setIsLoading(false);
      };
      fetchQuestion();
    } else {
      // Reset form for create mode
      setSelectedCategory(null);
      setTitle('');
      setDescription('');
      setImage('');
      setImageName('');
      setTags([]);
    }
  }, [type, questionId]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedCategory) newErrors.category = 'Category is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    //set errors to empty
    setErrors({});
    if (!validateForm()) {
      console.log('Form is invalid');
      return;
    }
    // Handle question submission logic here
    console.log({
      category: selectedCategory,
      title,
      description,
      image,
      tags,
    });
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage('');
      setImageName('');
    }
  };
  console.log('selectedCategory', selectedCategory);
  return type !== 'edit' && type !== 'create' ? (
    <div className="w-full">
      <h1 className="text-2xl md:hidden font-bold mb-4 text-foreground">My Questions</h1>
      <h1 className="hidden md:block text-3xl font-bold text-center mb-4 text-foreground">Your Questions</h1>

      <p className="text-muted-foreground mb-4">
        Here are the questions you have asked. You can view, edit, or delete them.
      </p>

      {/* Filter Tags - reuse Questions style */}
      <div className="flex items-center gap-4 my-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
        {[
          { title: 'New', icon: Clock },
          { title: 'Top', icon: Clock },
          { title: 'Hot', icon: Flame },
          { title: 'Trending', icon: Clock },
        ].map((tag, idx) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={idx}
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors whitespace-nowrap ${activeTag === tag.title
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            onClick={() => setActiveTag(tag.title)}
          >
            <tag.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tag.title}</span>
          </motion.button>
        ))}
      </div>

      <div className="space-y-6">
        {sampleQuestions.slice(0, 3).map((question) => (
          <QuestionCard key={question.id} question={question} type="my-questions" />
        ))}
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto mt-8 rounded-xl shadow-sm p-8 bg-card border border-border text-card-foreground">
      <form className="space-y-6" onSubmit={handleQuestionSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Category</label>
          <select
            className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-all"
            defaultValue=""
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="" disabled>
              Choose categories
            </option>
            {categories.map((category) => (
              <option key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <Error message={errors.category} />}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Type catching attention title"
            className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-all"
          />
          {errors.title && <Error message={errors.title} />}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            placeholder="Type your question"
            className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none transition-all"
          />
          {errors.description && <Error message={errors.description} />}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Tags</label>
          <div className="flex items-center">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value.split(','))}
              type="text"
              placeholder="Add a tag separated by comma"
              className="border border-border w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-all"
            />
          </div>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <div className="flex gap-2 items-center">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-muted text-muted-foreground px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-muted/80 transition-all border border-border"
            >
              <Image size={18} />
              <span className="text-sm font-medium">Add Image</span>
            </label>
            {errors.image && <Error message={errors.image} />}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="bg-muted text-muted-foreground px-6 py-2 rounded-xl cursor-not-allowed opacity-50 text-sm font-medium"
              disabled
            >
              Save as draft
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-8 py-2 rounded-xl hover:bg-primary/90 flex items-center gap-2 transition-all font-bold shadow-sm"
            >
              <Send size={18} />
              <span>Publish</span>
            </button>
          </div>
        </div>
        {image && (
          <div className="mt-4 relative group">
            <img src={image} alt="Selected" className="rounded-xl max-h-64 object-cover border border-border" />
            <button
              type="button"
              onClick={() => setImage('')}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const Error = ({ message }) => (
  <p className="text-sm text-error mt-1">{message}</p>
);

export default MyQuestions;
