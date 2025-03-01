export const NarratorStep = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">Narrator preference</h3>

        {/* Narrator Filters */}
        <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap sm:items-center sm:gap-6">
          <div className="flex w-[calc(50%-0.5rem)] items-center gap-2 sm:w-auto">
            <span className="text-xs font-medium text-gray-700 sm:text-sm">Gender</span>
            <select className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-700 sm:text-sm">
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="flex w-[calc(50%-0.5rem)] items-center gap-2 sm:w-auto">
            <span className="text-xs font-medium text-gray-700 sm:text-sm">Accent</span>
            <select className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-700 sm:text-sm">
              <option>All</option>
              <option>American</option>
              <option>British</option>
              <option>French</option>
            </select>
          </div>
          <div className="flex w-[calc(50%-0.5rem)] items-center gap-2 sm:w-auto">
            <span className="text-xs font-medium text-gray-700 sm:text-sm">Age</span>
            <select className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-700 sm:text-sm">
              <option>All</option>
              <option>Young</option>
              <option>Middle</option>
              <option>Senior</option>
            </select>
          </div>
          <div className="flex w-[calc(50%-0.5rem)] items-center gap-2 sm:w-auto">
            <span className="text-xs font-medium text-gray-700 sm:text-sm">Tone</span>
            <select className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-700 sm:text-sm">
              <option>All</option>
              <option>Professional</option>
              <option>Casual</option>
              <option>Friendly</option>
            </select>
          </div>
        </div>

        {/* Voice Over Section */}
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-base font-medium text-gray-900 sm:text-lg">Voice over</h4>
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-2 text-xs font-medium text-white hover:from-purple-700 hover:to-pink-600 sm:flex-none sm:px-4 sm:text-sm">
                + Clone your voice
              </button>
              <button className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:flex-none sm:px-4 sm:text-sm">
                View all
              </button>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {[
              { name: "Alexandre Boutin", style: "Casual", aiPicked: true },
              { name: "Miss Radio", style: "Modulated", selected: true },
              { name: "Guillaume", style: "Casual" },
              { name: "Adina", style: "Pleasant" },
              { name: "Guillaume", style: "Casual" },
              { name: "Claire", style: "Casual" },
            ].map((voice, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg border p-3 sm:p-4 ${
                  voice.selected ? "border-purple-200 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <button className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-600 sm:h-8 sm:w-8">
                    ▶
                  </button>
                  <span className="text-xs font-medium sm:text-sm">{voice.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {voice.aiPicked && (
                    <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600 sm:px-3 sm:py-1">
                      <span>✨</span>
                      <span>AI picked</span>
                    </span>
                  )}
                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600 sm:px-3 sm:py-1">
                    {voice.style}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Avatar Section */}
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-base font-medium text-gray-900 sm:text-lg">Video avatar</h4>
            <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-4 sm:text-sm">
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="flex aspect-square items-center justify-center rounded-xl border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mb-2 flex justify-center text-gray-400">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 sm:text-sm">No video avatar</span>
              </div>
            </div>
            {[
              { name: "Evelyn Carter", style: "Story-Telling", image: "/avatars/evelyn.jpg" },
              { name: "Lily Evans", style: "Story-Telling", image: "/avatars/lily.jpg" },
              { name: "Maya Foster", style: "Insightful", image: "/avatars/maya.jpg" },
              { name: "Natalie Rivera", style: "Calm Tone", image: "/avatars/natalie.jpg" },
              { name: "Isabella Carter", style: "Calm Tone", image: "/avatars/isabella.jpg" },
            ].map((avatar, index) => (
              <div key={index} className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-purple-200">
                <div className="aspect-square w-full bg-gray-100">
                  <img src={avatar.image} alt={avatar.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-2 sm:p-3">
                  <h5 className="text-xs font-medium text-gray-900 sm:text-sm">{avatar.name}</h5>
                  <span className="inline-block rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600 sm:px-2 sm:py-1">
                    {avatar.style}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 