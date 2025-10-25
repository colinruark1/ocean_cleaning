import { useState } from 'react';
import { Users, MapPin, Trophy, Plus, Search } from 'lucide-react';
import { useGroups } from '../hooks/useGroups';
import { useApp } from '../contexts/AppContext';
import { GROUP_CATEGORIES, GROUP_GRADIENTS } from '../constants';
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Badge,
  LoadingSpinner,
  EmptyState,
} from '../components/ui';
import PageHeader from '../components/layout/PageHeader';

/**
 * Groups Page
 * Browse, search, create, and join cleanup groups
 * Refactored with industry-standard patterns
 */
const Groups = () => {
  const { groups, isLoading, error, createGroup, joinGroup } = useGroups();
  const { showSuccess, showError } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [newGroup, setNewGroup] = useState({
    name: '',
    location: '',
    description: '',
    category: 'Local Community',
  });

  // Filter groups based on search query
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.location && group.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const result = await createGroup(newGroup);

    if (result.success) {
      showSuccess('Group created successfully!');
      setNewGroup({
        name: '',
        location: '',
        description: '',
        category: 'Local Community',
      });
      setShowCreateModal(false);
    } else {
      showError(result.error || 'Failed to create group');
    }

    setIsCreating(false);
  };

  const handleJoinGroup = async (groupId) => {
    const result = await joinGroup(groupId);
    if (result.success) {
      showSuccess('You have joined the group!');
    } else {
      showError(result.error || 'Failed to join group');
    }
  };

  const handleInputChange = (field, value) => {
    setNewGroup(prev => ({ ...prev, [field]: value }));
  };

  const getGradient = (image) => {
    return GROUP_GRADIENTS[image] || GROUP_GRADIENTS.default;
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading groups: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Cleanup Groups"
        description="Discover and join community groups dedicated to ocean cleanup"
        action={
          <Button
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Group
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search groups by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-5 w-5" />}
        />
      </div>

      {/* Groups List */}
      {isLoading ? (
        <LoadingSpinner message="Loading groups..." />
      ) : filteredGroups.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title={searchQuery ? 'No groups found' : 'No groups available'}
          description={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Be the first to create a cleanup group in your area!'
          }
          action={
            !searchQuery && (
              <Button onClick={() => setShowCreateModal(true)}>
                Create First Group
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} hoverable className="overflow-hidden">
              <div className={`h-32 bg-gradient-to-r ${getGradient(group.image)}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">{group.name}</h3>
                </div>

                {group.location && (
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {group.location}
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold text-ocean-600">{group.members}</p>
                    <p className="text-xs text-gray-600">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{group.cleanups}</p>
                    <p className="text-xs text-gray-600">Cleanups</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{group.trash}</p>
                    <p className="text-xs text-gray-600">Trash</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant="primary" size="sm">
                    {group.category}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    Join Group
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Group"
        size="md"
      >
        <form onSubmit={handleCreateGroup}>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Group Name"
                type="text"
                required
                value={newGroup.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Ocean Warriors"
              />

              <Input
                label="Location"
                type="text"
                value={newGroup.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Los Angeles, CA"
                helperText="Optional: Specify your group's location"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newGroup.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                >
                  {GROUP_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Description"
                required
                value={newGroup.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your group's mission and activities..."
                rows={4}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isCreating}
              disabled={isCreating}
            >
              Create Group
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Groups;
