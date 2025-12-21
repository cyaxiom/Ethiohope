import React from 'react';
import Container from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';

export default function FullStackDev() {
	return (
		<Container className="py-16">
			<div className="max-w-4xl mx-auto text-center">
				<Heading as="h1" variant="h1">Full Stack Development</Heading>
				<Text size="lg" className="mt-4 text-muted-foreground">
					Learn the tools and frameworks to build modern web applications — responsive, accessible, and production ready.
				</Text>
			</div>
		</Container>
	);
}
