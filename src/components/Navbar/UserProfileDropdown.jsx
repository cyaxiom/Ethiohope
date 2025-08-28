// @components/UserProfileDropdown/UserProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  Home,
  BookOpen,
  User,
  Award,
  Star,
  MessageCircle,
  Settings,
  Palette,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const iconComponents = {
  Home,
  BookOpen,
  User,
  Award,
  Star,
  MessageCircle,
  Settings,
  Palette,
  Bell,
  LogOut,
};

const CollapsibleSection = ({ children, isExpanded }) => {
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: `${height}px` }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

const UserProfileDropdown = ({ links, isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState({});

  if (!isOpen) return null;

  const toggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const renderDropdownItem = (item, level = 0) => {
    const IconComponent = iconComponents[item.icon] || User;
    const isExpanded = expandedItems[item.name];
    const hasDropdown = item.dropdown && item.dropdown.length > 0;

    return (
      <div key={item.path || item.name} className="relative">
        {hasDropdown ? (
          <button
            onClick={() => toggleExpand(item.name)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-cyan-500 transition-all duration-200 rounded-md"
          >
            <div className="flex items-center">
              <IconComponent className="w-4 h-4 mr-3 transition-colors duration-200" />
              <span className="transition-colors duration-200">
                {item.name}
              </span>
            </div>
            {hasDropdown && (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>
        ) : (
          <a
            href={item.path}
            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-cyan-500 transition-all duration-200 rounded-md"
          >
            <IconComponent className="w-4 h-4 mr-3 transition-colors duration-200" />
            <span className="transition-colors duration-200">{item.name}</span>
          </a>
        )}

        {hasDropdown && (
          <CollapsibleSection isExpanded={isExpanded}>
            <div className="ml-6 pl-1 border-l-2 border-cyan-500/30 mt-1">
              {item.dropdown.map((subItem) =>
                renderDropdownItem(subItem, level + 1)
              )}
            </div>
          </CollapsibleSection>
        )}
      </div>
    );
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-background border border-border/20 rounded-lg shadow-xl z-50 p-2 transition-all duration-300 ease-out">
      <div className="space-y-1">
        {links.map((item) => renderDropdownItem(item))}

        {/* Logout button */}
        <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-red-500 transition-all duration-200 rounded-md mt-2 border-t border-border/20 pt-2">
          <LogOut className="w-4 h-4 mr-3 transition-colors duration-200" />
          <span className="transition-colors duration-200">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
