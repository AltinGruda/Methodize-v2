import { BarChart, StickyNote, Target, Users, } from "lucide-react";

function FeaturesBlocks() {
  return (
    <section className="relative">

      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 bg-gray-900 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">And more</h2>
            {/* <p className="text-xl text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.</p> */}
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">

            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="text-white" />
              </div>

              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Teams</h4>
              <p className="text-gray-600 text-center">Foster project collaboration.</p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">

              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Target className="text-white" />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Projects</h4>
              <p className="text-gray-600 text-center">Streamline with task management.</p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <StickyNote className="text-white" />
              </div>

              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Sticky Notes</h4>
              <p className="text-gray-600 text-center">Digital idea snapshots.</p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl lg:col-start-2">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <BarChart className="text-white" />
              </div>

              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Charts</h4>
              <p className="text-gray-600 text-center">Visualize data insights.</p>
            </div>

          </div>

          

        </div>
      </div>
    </section>
  );
}

export default FeaturesBlocks;
