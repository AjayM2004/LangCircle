import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import { useState } from "react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [nativeLangFilter, setNativeLangFilter] = useState("");
  const [learningLangFilter, setLearningLangFilter] = useState("");

  const filteredFriends = friends.filter((friend) => {
    const nameMatch = friend.fullname.toLowerCase().includes(searchTerm.toLowerCase());
    const nativeMatch = friend.nativeLanguage.toLowerCase().includes(nativeLangFilter.toLowerCase());
    const learningMatch = friend.learningLanguage.toLowerCase().includes(learningLangFilter.toLowerCase());

    return nameMatch || nativeMatch || learningMatch;
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-base-100">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-full bg-base-100">
        <div className="container mx-auto max-w-7xl space-y-10 min-h-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
            <Link to="/notifications" className="btn btn-outline btn-sm flex-shrink-0">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name"
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by native language"
              className="input input-bordered w-full"
              value={nativeLangFilter}
              onChange={(e) => setNativeLangFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by learning language"
              className="input input-bordered w-full"
              value={learningLangFilter}
              onChange={(e) => setLearningLangFilter(e.target.value)}
            />
          </div>

          {/* Results */}
          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {filteredFriends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
