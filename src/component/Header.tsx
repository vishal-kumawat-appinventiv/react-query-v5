import React, { useState } from "react";
import toast from "react-hot-toast";
import { OrderType } from "../types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface HeaderProps {
  onAddPost: (title: string) => Promise<void>;
  onSearch: (searchTerm: string) => void;
  onOrderChange: (order: OrderType) => void;
}

const Header: React.FC<HeaderProps> = ({
  onAddPost,
  onSearch,
  onOrderChange,
}) => {
  const [title, setTitle] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [order, setOrder] = useState<OrderType>("none");

  const handleAddPost = async () => {
    if (!title.trim()) {
      toast.error("Empty title cannot be added!");
      return;
    }
    await onAddPost(title);
    setTitle("");
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value as OrderType;
    setOrder(newOrder);
    onOrderChange(newOrder);
  };
  
  const handleDownloadPDF = async () => {
    try {
      const canvas = await html2canvas(document.body);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("screenshot.pdf");
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  return (
    <div className="mb-6">
      <h1 className="flex items-center justify-between gap-2 text-md md:text-2xl font-bold mb-4 text-white">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="w-8" />
          React Tanstack Query V5 + Pagination Demo
        </div>
        <button className="text-sm" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </h1>
      <div className="flex flex-col lg:flex-row items-center gap-2 justify-between w-full">
        <div className="flex items-center w-full">
          <input
            type="text"
            className="p-2 w-full lg:w-3/4 border-none outline-none rounded-l-lg bg-gray-700 text-white"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Enter post title"
          />
          <button
            onClick={handleAddPost}
            className="min-w-20 text-white px-4 py-2 rounded-r-lg bg-slate-900"
          >
            Add
          </button>
        </div>
        <div className="flex items-center w-full">
          <input
            type="text"
            className="p-2 w-full lg:w-3/4 border-none outline-none rounded-l-lg bg-gray-700 text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="Search by title.."
          />
          <button
            onClick={handleSearch}
            className="min-w-20 text-white px-4 py-2 rounded-r-lg bg-slate-900"
          >
            Search
          </button>
        </div>
        <div>
          <select
            onChange={handleOrderChange}
            className="p-2 border rounded-lg dark:bg-gray-700 text-white border-gray-600 border-none outline-none"
            value={order}
          >
            <option value="none">None</option>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
