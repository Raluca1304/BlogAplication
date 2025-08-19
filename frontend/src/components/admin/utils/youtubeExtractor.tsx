export default function YoutubeExtractor({id} : {id : string}) {

   return (
    <div className="w-full">
        <iframe 
            className="aspect-video w-full"
            src={"https://www.youtube.com/embed/" + id}
            title="YouTube Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
    </div>
   );
};

