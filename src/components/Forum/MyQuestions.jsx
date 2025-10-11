import { Image, Send } from 'lucide-react';
import React from 'react';
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
    <div>
      <h1 className="text-2xl font-bold mb-2 md:hidden">My Questions</h1>
      <p className="text-muted-foreground">
        Here are the questions you have asked. You can view, edit, or delete
        them.
      </p>
      <div className="mt-8 space-y-6">
        {sampleQuestions.slice(0, 3).map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            type="my-questions"
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto mt-8 rounded-lg shadow p-8 bg-card text-card-foreground">
      <form className="space-y-6" onSubmit={handleQuestionSubmit}>
        <select
          className="w-full border border-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-success bg-background text-foreground"
          defaultValue=""
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>
            Choose categories
          </option>
          {categories.map((category) => (
            <option
              key={category.id}
              // onChange={() => setSelectedCategory(category.name.toLowerCase())}
              // value={category.name.toLowerCase()}
            >
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && <Error message={errors.category} />}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Type catching attention title"
          className="w-full border border-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-success bg-background text-foreground"
        />
        {errors.title && <Error message={errors.title} />}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          placeholder="Type your question"
          className="w-full border border-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-success bg-background text-foreground resize-none"
        />
        {errors.description && <Error message={errors.description} />}
        {/* add tags */}
        <div className="flex items-center mt-4">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value.split(','))}
            type="text"
            placeholder="Add a tag separeted by comma"
            className="border border-border w-full rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-success bg-background text-foreground"
          />
          {/* <button
            type="button"
            className="bg-primary text-primary-foreground px-4 py-2 rounded ml-2"
          >
            Add Tag
          </button> */}
        </div>
        <div className="mt-2">
          <span className="text-sm text-muted-foreground">Tags:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* add image */}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
          />
          <div className="flex gap-2 items-center">
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-primary text-primary-foreground px-2 md:px-4 py-1 md:py-2 rounded flex items-center gap-2 hover:bg-primary/80"
            >
              <div className="flex items-center gap-2 ">
                <Image size={18} />
                <span>Add Image</span>
              </div>
            </label>

            {errors.image && <Error message={errors.image} />}
          </div>
          {/* <div>
            {image && <img src={image} alt="Selected" className="mt-4" />}
          </div> */}
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-muted text-muted-foreground px-1  md:px-4 py-1 md:py-2 rounded cursor-not-allowed"
              disabled
            >
              Save as draft
            </button>
            <button
              type="submit"
              className="bg-warning text-white px-1 md:px-4 py-1 md:py-2 rounded hover:bg-error flex items-center gap-2"
            >
              <Send size={18} />
              <span>Publish</span>
            </button>
          </div>
        </div>
        <div>
          {image && <img src={image} alt="Selected" className="mt-4" />}
        </div>
      </form>
    </div>
  );
};

const Error = ({ message }) => (
  <p className="text-sm text-error mt-1">{message}</p>
);

export default MyQuestions;
