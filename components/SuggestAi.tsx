"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2 } from "lucide-react";

const genAI = new GoogleGenerativeAI("AIzaSyBmbfaMFOE36J8MPUxsd9v1Mfza62PBzDQ");

const ProjectSuggestor = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjectIdeas = async () => {
    setLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Json list of 5 small sentences giving idea of a new coding project. Awalys Make sure no extra strings only json response which is loopable. Format should be [sentence1,sentence2,sentence3,sentence4,sentence5]";

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    setIdeas(JSON.parse(text));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
        <button
          onClick={fetchProjectIdeas}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? (
            <>
              <Loader2 />
            </>
          ) : (
            <>Get Project Ideas</>
          )}
        </button>
        {ideas.length > 0 && (
          <div className="mt-4">
            <ul className="list-disc list-inside">
              {ideas.map((idea, index) => (
                <li key={index}>{idea}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSuggestor;
