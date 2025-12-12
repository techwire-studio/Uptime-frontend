import { Routes } from "@/constants";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ routeTo = Routes.MONITORS, label = "Monitors" }) => {
  return (
    <Link to={routeTo}>
      <Button className="my-4 bg-primary border-primary text-xs text-white hover:bg-gray-700">
        <ArrowLeft size={16} />
        <div className="text-sm">{label}</div>
      </Button>
    </Link>
  );
};
export default BackButton;
