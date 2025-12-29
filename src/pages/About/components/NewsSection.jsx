import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';

function NewsSection() {
  return (
    <div className="py-20 bg-muted/30 dark:bg-muted/60 overflow-hidden">
      <Container>
        <h2 className="text-4xl font-bold mb-6 text-center text-foreground">Latest News</h2>
        <div className="flex items-center justify-center mb-12">
          <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-primary/20"></div>
        </div>
        <p className="text-xl text-center mb-16 text-muted-foreground">
          Read more about latest news and our special event
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img 
                  src={`https://source.unsplash.com/random/400x300?tech=${item}`}
                  alt="News" 
                  className="w-full h-40 md:h-48 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <p className="text-sm uppercase font-bold mb-2 text-white">HEADLINE</p>
                  <h3 className="text-lg font-bold text-white">
                    Sed imperdiet enim ligula, vitae viverra justo porta vel.
                  </h3>
                </div>
              </div>
              <Link 
                to="/blog" 
                className="inline-block px-6 py-2 rounded bg-primary text-white font-bold uppercase transition-all hover:bg-primary/90 shadow-lg hover:shadow-primary/20"
              >
                READ MORE
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default NewsSection;
