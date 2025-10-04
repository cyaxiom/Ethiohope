import { useState } from 'react';
import React from 'react';
import { getTags } from '../../api/forum';

export default function Tags() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  console.log('tags component rendered');
  const [filteredTags, setFilteredTags] = useState([]);
  // Filter + sort tags
  React.useEffect(() => {
    const fetchTags = async () => {
      const res = await getTags(search, sort);
      if (!res.success) {
        alert('unexpected error happens');
      }
      setFilteredTags(res.data);
    };
    fetchTags();
  }, [search, sort]);

  console.log('filteredTags', filteredTags);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* Sort options */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTags.map((tag, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-blue-600 font-medium text-lg">#{tag.name}</h3>
            <p className="text-sm  mt-1 line-clamp-2">{tag.description}</p>

            <div className="flex justify-between items-center mt-4 text-sm ">
              <span>{tag.questions} questions</span>
              <span>{tag.followers} followers</span>
            </div>

            {/* <button className="mt-4 w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100">
              Follow
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
