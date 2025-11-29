"use client";

interface FeatureItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function FeatureItem({
  title,
  description,
  icon,
}: FeatureItemProps) {
  return (
    <div className="flex items-start group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
        {icon ? (
          <span className="text-2xl">{icon}</span>
        ) : (
          <span className="text-white text-xl font-bold">✓</span>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-lg text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
