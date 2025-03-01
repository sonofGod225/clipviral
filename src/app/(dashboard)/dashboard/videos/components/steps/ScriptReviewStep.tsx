import { LuPencil } from "react-icons/lu";

export const ScriptReviewStep = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-gray-900 sm:text-lg">Script review</h3>
          <span className="text-xs text-gray-500 sm:text-sm">(Approx. 51s)</span>
        </div>
        <button className="w-full rounded-lg border border-purple-200 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:w-auto">
          Regenerate script
        </button>
      </div>

      {/* Script Sections */}
      <div className="space-y-3 sm:space-y-4">
        {[
          {
            image: "/temp/scene1.jpg",
            text: "Saviez-vous que dans la Rome antique, les femmes achetaient de la sueur de gladiateur pour leurs soins de beauté? Une étrange obsession!"
          },
          {
            image: "/temp/scene2.jpg",
            text: "Les Egyptiennes utilisaient des excréments de crocodile comme contraceptif, une méthode peu engageante mais apparemment efficace!"
          },
          {
            image: "/temp/scene3.jpg",
            text: "Les Vikings avaient une tradition troublante: une esclave devait mourir avec son maître, provoquant une sacree cérémonie!"
          }
        ].map((scene, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-lg border border-gray-100 p-3 sm:flex-row sm:gap-4 sm:p-4">
            <div className="h-32 w-full overflow-hidden rounded-lg sm:h-24 sm:w-24 sm:flex-shrink-0">
              <img src={scene.image} alt={`Scene ${index + 1}`} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 items-start justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500">Audio script</div>
                <p className="mt-1 text-xs text-gray-900 sm:text-sm">{scene.text}</p>
              </div>
              <button className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:p-2">
                <LuPencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Scene Button */}
      <button className="mt-4 flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 sm:mt-4 sm:py-3 sm:text-sm">
        + Add more
      </button>
    </div>
  );
}; 