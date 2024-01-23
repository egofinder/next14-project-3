"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const testimonials = [
  {
    name: "Tester 1",
    title: "Web Developer",
    description: "I am a web developer and I am very interested in AI.",
  },
  {
    name: "Tester 2",
    title: "Developer",
    description: "This is a test description.",
  },
  {
    name: "Tester 3",
    title: "Web Designer",
    description: "I like to design websites and I am very interested in AI.",
  },
  {
    name: "Tester 4",
    title: "Administator",
    description: "Awesome!",
  },
  {
    name: "Tester 5",
    title: "Customer",
    description: "Super Cool!",
  },
  {
    name: "Tester 6",
    title: "Bookkeeper",
    description: "Good Test weibste.",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{testimonial.name}</p>
                  <p className="text-zinc-400 text-sm">{testimonial.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {testimonial.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
