'use client'
import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { DebouncedInput } from '@/components/DebounceInput';
import { Friend } from '@/lib/types/friend';

const SearchFriends: React.FC = () => {
  const userId = useSelector((state: RootState) => state.userData.id);

  const [friends, setFriends] = useState<Friend[]>([
    // Example friends data; in a real scenario, you would fetch this data
    { id: '1', firstName: 'John', lastName: 'Doe' },
    { id: '2', firstName: 'Jane', lastName: 'Smith' },
    { id: '3', firstName: 'Jake', lastName: 'Johnson' },
  ]);
  const [searchResults, setSearchResults] = useState<Friend[]>(friends);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setLoading(true);
    const trimmedQuery = query.trim().toLowerCase();
    const results = friends.filter(
      (friend) =>
        friend.firstName.toLowerCase().includes(trimmedQuery) ||
        friend.lastName.toLowerCase().includes(trimmedQuery)
    );
    setSearchResults(results);
    setLoading(false);
  };

  const handleWait = () => {
    setLoading(true);
  };

  return (
    <div>
      <DebouncedInput
        onUserStopTyping={handleSearch}
        onWait={handleWait}
        onChange={(e) => {console.log(e.target.value)}}
        placeholder="Search friends..."
        fontSize={16}
        delay={2000}
        width={300}
        isCenter={false}
        value=""
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {searchResults.map((friend) => (
            <li key={friend.id}>
              {friend.firstName} {friend.lastName}
            </li>
          ))}
        </ul>
      )}

      {/* Display a message when there are no search results */}
      {!loading && searchResults.length === 0 && (
        <div>No friends found</div>
      )}
    </div>
  );
};

export default SearchFriends;
