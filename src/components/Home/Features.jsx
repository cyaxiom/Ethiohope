import React from 'react';
import { DS } from '@/constants/designSystem';
import { SectionContainer } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

export default function Features() {
  const features = [
    {
      title: "Fast",
      description: "Don't keep your users waiting. Solana has block times of 400 milliseconds — and as hardware gets faster, so will the network.",
      stat: "3,969",
      label: "Transactions Per Second",
      color: "accent"
    },
    {
      title: "Decentralized",
      description: "The Solana network is validated by thousands of nodes that operate independently, ensuring your data remains secure and censorship resistant.",
      stat: "1,675",
      label: "Validator Nodes",
      color: "warning"
    },
    {
      title: "Scalable",
      description: "Get big, quick. Solana is made to handle thousands of transactions per second, while fees remain less than $0.01.",
      stat: "163,077,581,394",
      label: "Total Transactions",
      color: "success"
    },
    {
      title: "Energy Efficient",
      description: "Solana's proof of stake network minimizes impact on the environment. Each transaction uses about the same energy as a few Google searches.",
      stat: "0%",
      label: "Net Carbon Impact",
      color: "info"
    }
  ];

  return (
    <section className="relative bg-background text-foreground overflow-hidden">
      <SectionContainer sectionSpacing="xl" containerSize="xl">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left Section */}
          <div className="w-full lg:w-1/3">
            <Heading variant="h2" className="mb-2">Made for mass adoption.</Heading>
            <a 
              href="#"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline underline-offset-4"
            >
              • LIVE DATA
            </a>
          </div>

          {/* Right Section: Feature Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fast */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="w-1 h-6 bg-accent mr-3 rounded-sm"></span>Fast
            </h3>
            <p className="text-muted-foreground mb-4">
              Don't keep your users waiting. Solana has block times of 400 milliseconds — and as hardware gets faster, so will the network.
            </p>
            <div className="text-2xl font-bold text-accent mb-2">3,969</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Transactions Per Second
            </div>
          </div>

          {/* Decentralized */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="w-1 h-6 bg-warning mr-3 rounded-sm"></span>Decentralized
            </h3>
            <p className="text-muted-foreground mb-4">
              The Solana network is validated by thousands of nodes that operate independently, ensuring your data remains secure and censorship resistant.
            </p>
            <div className="text-2xl font-bold text-warning mb-2">1,675</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Validator Nodes
            </div>
          </div>

          {/* Scalable */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="w-1 h-6 bg-success mr-3 rounded-sm"></span>Scalable
            </h3>
            <p className="text-muted-foreground mb-4">
              Get big, quick. Solana is made to handle thousands of transactions per second, while fees remain less than $0.01.
            </p>
            <div className="text-2xl font-bold text-success mb-2">163,077,581,394</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total Transactions
            </div>
          </div>

          {/* Energy Efficient */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="w-1 h-6 bg-info mr-3 rounded-sm"></span>Energy Efficient
            </h3>
            <p className="text-muted-foreground mb-4">
              Solana’s proof of stake network minimizes impact on the{" "}
              <span className="text-success font-medium">environment</span>. Each transaction uses about the same energy as a few Google searches.
            </p>
            <div className="text-2xl font-bold text-info mb-2">0%</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Net Carbon Impact
            </div>
          </div>
            {features.map((feature, idx) => (
              <Card
                key={idx}
                padding="lg"
                hoverable
                interactive
                className="h-full flex flex-col"
              >
                <Heading variant="h4" className="mb-3 flex items-center line-clamp-1">
                  <span className={`w-1 h-6 bg-${feature.color} mr-3 rounded-sm flex-shrink-0`}></span>
                  {feature.title}
                </Heading>
                <Text className="mb-4 flex-grow line-clamp-4">
                  {feature.description}
                </Text>
                <div className={`text-2xl font-bold text-${feature.color} mb-2`}>
                  {feature.stat}
                </div>
                <Text size="xs" className="uppercase tracking-wider font-medium line-clamp-1">
                  {feature.label}
                </Text>
              </Card>
            ))}
        </div>
      </div>
    </SectionContainer>
    </section>
  );
}
