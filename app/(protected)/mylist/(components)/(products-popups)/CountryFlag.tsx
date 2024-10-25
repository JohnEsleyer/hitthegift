'use client'

interface CountryFlagProps{
    currency: string;
}

export default function CountryFlag({currency}: CountryFlagProps){
    return (
        <div>
              <img width={20} alt="" src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/currencies/${currency}.svg`}/> 
        </div>
    )
}