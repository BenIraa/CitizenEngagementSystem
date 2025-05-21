
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { categories } from '@/lib/data';
import { ComplaintFilters as ComplaintFiltersType } from '@/lib/types';

interface ComplaintFiltersProps {
  onApplyFilters: (filters: ComplaintFiltersType) => void;
  isAdminView?: boolean;
}

// Define the status and priority types to match the expected types in ComplaintFiltersType
type StatusType = 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({ 
  onApplyFilters,
  isAdminView = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<StatusType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityType[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Define the available statuses and priorities as arrays of the correct type
  const statuses: StatusType[] = ['new', 'assigned', 'in-progress', 'resolved', 'closed'];
  const priorities: PriorityType[] = ['low', 'medium', 'high', 'urgent'];

  const handleStatusChange = (status: StatusType) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriorityChange = (priority: PriorityType) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const applyFilters = () => {
    onApplyFilters({
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      category: selectedCategories.length > 0 ? selectedCategories : undefined,
      priority: selectedPriorities.length > 0 ? selectedPriorities : undefined,
      searchTerm: searchTerm.trim() !== '' ? searchTerm : undefined,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSelectedPriorities([]);
    onApplyFilters({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>

        {filtersVisible && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`} 
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => handleStatusChange(status)}
                      />
                      <Label 
                        htmlFor={`status-${status}`}
                        className="capitalize"
                      >
                        {status === 'in-progress' ? 'In Progress' : status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <h4 className="font-medium mb-2">Priority</h4>
                <div className="space-y-2">
                  {priorities.map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`priority-${priority}`} 
                        checked={selectedPriorities.includes(priority)}
                        onCheckedChange={() => handlePriorityChange(priority)}
                      />
                      <Label 
                        htmlFor={`priority-${priority}`}
                        className="capitalize"
                      >
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <div className="h-[200px] overflow-y-auto pr-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label 
                        htmlFor={`category-${category}`}
                        className="capitalize"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintFilters;
