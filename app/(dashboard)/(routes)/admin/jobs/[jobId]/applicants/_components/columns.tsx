"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns"; // ✅ Format date

export type ApplicantsColumns = {
  id: string;
  fullName: string;
  email: string;
  contact: string;
  resume: string;       // Resume URL
  resumeName: string;   // Display name
  appliedAt: string;    // ISO date string
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-purple-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-purple-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-purple-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "resumeName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-purple-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Resume Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-purple-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Applied At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const appliedAt = row.original.appliedAt;
      const formatted = appliedAt ? format(new Date(appliedAt), "MMM dd, yyyy") : "N/A";
      return <span className="text-sm text-purple-100">{formatted}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, resume } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black/80 border border-purple-600 text-purple-200">
            <Link href={`/admin/applicants/${id}`}>
              <DropdownMenuItem className="hover:bg-purple-700/20">
                <Pencil className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </Link>
            {resume && (
              <a href={resume} target="_blank" rel="noopener noreferrer">
                <DropdownMenuItem className="hover:bg-purple-700/20">
                  <Eye className="h-4 w-4 mr-2" />
                  View Resume
                </DropdownMenuItem>
              </a>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];