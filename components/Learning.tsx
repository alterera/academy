import React from "react";

const Learning = () => {
  return (
    <div className="w-full bg-[#fdecff] py-20 my-5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold pb-5">
          What you'll learn
        </h2>

        <ul className="list-disc pl-4 leading-relaxed text-xl">
            <li>Getting access to WhatsApp API to begin messaging customers in just 5 minutes</li>
            <li>Crafting and sending message templates for engaging with customers proactively</li>
            <li>Securing the WhatsApp green tick to enhance your business's credibility</li>
            <li>Expanding chat entry points to encourage more customer interactions</li>
        </ul>
      </div>
    </div>
  );
};

export default Learning;
