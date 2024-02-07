"use client";

import { useState } from 'react'
import { IconMark, TitleMark, TypeMark } from '../lib/img/logos';
import { SearchBar } from './search/[searchQuery]/searchBar'
import { Icon, InteractiveIcon } from '../lib/icons/ui-icons';
import React, { useRef, useEffect } from "react";
import ClickOutside from '../lib/utils/ClickOutside';
import Link from 'next/link';
import { MW_URL } from '../lib/definitions';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';


export default function NavBar() {
    const params = useParams<{ searchQuery: string }>();
    const path = usePathname();
    const router = useRouter();

    
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [isSearchOpen, setIsSearchOpen] = useState(false); 

    useEffect(() => {
        setIsSearchOpen(path.includes('/search'));
      }, [path])

    const toggleSearch = () => {
        if (!isSearchOpen && isMenuOpen) { // Close menu if entering search
            setIsMenuOpen(false);
        }
        console.log('Setting Search '+!isSearchOpen);
        setIsSearchOpen(!isSearchOpen);
    }

    const toggleMenu = () => {
        console.log('[NavBar] Toggling menu');
        setIsMenuOpen(!isMenuOpen);
    }

    const closeMenu = () => {
        if (isMenuOpen) {
        console.log('[NavBar] Closing menu');
        setIsMenuOpen(false);
        }
    }

    return (        
    <div className="sticky w-100 h-min -mb-1.5 z-10">
        <div className="h-14 b border-b-black border-b-6 flex flex-nowrap">
            <TypeMark styles='h-full p-2.5 ml-2'/>
            <div className="w-full justify-self-end flex flex-nowrap justify-end" ref={menuButtonRef}>
                { path.includes('/search') ? '' : <InteractiveIcon name={ isSearchOpen ? 'search-open' : 'search'} onClick={() => toggleSearch()} styles={'cursor-pointer aspect-square h-full aspect-square ' + (isSearchOpen ? 'p-1' : 'p-1.5')}/>}
                <InteractiveIcon name={ isMenuOpen ? 'menu-open' : 'menu'} onClick={() => toggleMenu()} styles='cursor-pointer aspect-square h-full aspect-square p-1'/>
            </div>
        </div>
        {isMenuOpen ? (<ClickOutside onClick={closeMenu} exceptionRef={menuButtonRef}><MenuDropdown styles={(isMenuOpen ? "hidden" : '')}/></ClickOutside>) : ''}
        {isSearchOpen || path.includes('/search') ? (<SearchBar searchQuery={params.searchQuery} prompt="" styles="w-100 h-14 -top-1.5 border-y-black border-y-6 pl-1.5" icon="" button />) : ''}
    </div>
);
}

function MenuDropdown({styles=''}) {
    const menuItems = [
        {title: 'Home', icon: 'home', href: '/', p:'0.25'},
        //{title: 'Browse', icon: 'globe', href: '/browse', p:'0.5'},
        {title: 'Contribute', icon: 'write', href: MW_URL, p:'1'},
        {title: 'Policies', icon: 'policy', href: '/policy', p:'0.5'},
        //{title: 'About', icon: 'info', href: '/about', p:'0.5'},
    ];
 
    return (
        <Dropdown items={menuItems} styles="absolute right-0"/>
    )
}

function Dropdown({items, styles=''}: {items:{title:string,icon:string,href:string,p:string}[], styles?:string}) {
    return (
        <div className={styles+' b border-x-black border-x-6 flex flex-nowrap flex-col z-50 text-xl font-medium -pt-1.5'}>
            {items.map((item) => {
                return (
                    <div key={item.title} onClick={(e)=>{e.preventDefault()}} className='flex flex-row h-12 cursor-pointer relative bg-tan -pb-1.5 items-center justify-start pr-9 border-b-black border-b-6'>
                        <Icon name={item.icon} styles={' h-9 aspect-square ml-1 mr-1.5 p-'+item.p}/>
                        <p>{item.title}</p>
                        <Link href={item.href} className='absolute top-0 bottom-0 left-0 right-0 ml-0.5'></Link>
                    </div>
                );
            })}
        </div>
    )
}

