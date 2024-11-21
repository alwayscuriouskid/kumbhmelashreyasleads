import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FiltersSectionProps {
  categories: string[];
  tags: string[];
  selectedFilters: {
    categories: string[];
    tags: string[];
  };
  toggleFilter: (type: 'categories' | 'tags', value: string) => void;
  handleDeleteCategory: (category: string) => void;
  handleDeleteTag: (tag: string) => void;
}

export const FiltersSection = ({
  categories,
  tags,
  selectedFilters,
  toggleFilter,
  handleDeleteCategory,
  handleDeleteTag,
}: FiltersSectionProps) => {
  return (
    <div className="py-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.categories.includes(category)}
                  onChange={() => toggleFilter('categories', category)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{category}</span>
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleDeleteCategory(category)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.tags.includes(tag)}
                  onChange={() => toggleFilter('tags', tag)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{tag}</span>
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleDeleteTag(tag)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};