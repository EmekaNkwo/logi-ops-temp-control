"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface LoadDetailHeaderProps {
  loadId: string;
}

export default function LoadDetailHeader({ loadId }: LoadDetailHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/loads"
        className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-4 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Loads
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Load Details
          </h1>
          <p className="text-gray-600">
            Load ID:{" "}
            <span className="font-mono text-primary-600">
              {loadId.slice(0, 8)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
