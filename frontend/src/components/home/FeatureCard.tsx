"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  icon?: React.ReactNode;
}

export default function FeatureCard({
  title,
  description,
  href,
  buttonText,
  icon,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-primary-200 hover:-translate-y-1">
      {icon && (
        <div className="mb-4 text-5xl flex items-center justify-center h-16">
          {typeof icon === "string" ? <span>{icon}</span> : icon}
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed min-h-[4rem]">
        {description}
      </p>
      <Link href={href} className="block">
        <Button variant="primary" size="lg" className="w-full">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
