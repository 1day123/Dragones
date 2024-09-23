import React from 'react';

export default function CardTitle({label, ...props}){

	return (
       <div className="card-title px-4 py-1 border-round-xl -mt-6 mb-3">
            <h2 className="text-xl">{label}</h2>
        </div>
    );
}