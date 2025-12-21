import { useState } from 'react';
import React from 'react';
import { getTags } from '../../api/forum';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';

export default function Tags() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
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

  return (
    <div className="p-6 bg-background text-foreground">
      {/* Header */}
      <h1 className="text-2xl md:hidden font-bold mb-4">Tags</h1>
      <div className="flex justify-between items-center mb-6">
        {/* Sort options */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
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
          className="w-full md:w-1/2 border border-border rounded-lg px-4 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTags.map((tag, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-primary font-bold text-lg">
              #{tag.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tag.description}</p>

            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <span>{tag.questions} questions</span>
              <span>{tag.followers} followers</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
