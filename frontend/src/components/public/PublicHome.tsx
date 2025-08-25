import { Button } from '@/components/ui/button';
import React, { JSX } from 'react';
import { NavLink } from 'react-router';
import { ArrowRight} from 'lucide-react'; 

export function PublicHome(): JSX.Element {
    return (
        <React.Fragment>
            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Our Blog</h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Discover amazing articles, stories, and insights from our community of writers. 
                    Explore the latest posts and join the conversation!
                </p>
            </div>
            <div className="flex justify-left mb-8 gap-4 flex-wrap px-4 ml-80">
                <img 
                src="/api/principal_photo2.jpg" 
                alt="Principal photo2" 
                className="object-top-left h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '600px' }}
                />
                <div className="flex justify-start mb-8 gap-4 px-4 grid grid-rows-2" >
                    <img 
                    src="/api/principal_photo.jpg" 
                    alt="Principal photo" 
                    className="max-w-full h-auto rounded-lg shadow-lg mb-10"
                    style={{ maxHeight: '250px' }}
                    />
                    <img 
                    src="/api/principal_photo5.jpg" 
                    alt="Principal photo6" 
                    className="max-w-full h-auto rounded-lg shadow-lg mt-10"
                    style={{ maxHeight: '250px' }}
                    />
                </div>
                <div className="flex justify-start mb-8 gap-4 px-4" >
                    <img 
                    src="/api/principal_photo3.jpg" 
                    alt="Principal photo5" 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '600px' }}
                    />
                </div>

                                 <div className="flex items-center justify-end gap-4 px-4" >
                     <NavLink to="/public/posts" className="group">
                         <ArrowRight className="ml-30 h-20 w-20 text-gray-500 transition-all duration-300 ease-in-out 
                                               group-hover:text-gray-400 group-hover:scale-110 
                                               group-hover:drop-shadow-xl cursor-pointer transform
                                               hover:translate-x-2" />
                     </NavLink>
                 </div>
            </div>
        </React.Fragment>
    );
}