"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SearchComponent() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" placeholder="Search your file" />
      <Button type="button">Search</Button>
    </div>
  );
}
export default SearchComponent;
