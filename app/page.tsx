import Image from 'next/image'
import { Input } from 'postcss'
import { SearchBar } from './(content)/search/[searchQuery]/searchBar'
import { Icon } from './lib/icons/ui-icons'
import { REPORT_TYPES } from './lib/definitions'
import BrandSearchIcon from './lib/img/brandSearchIcon'
import { IconMark, TitleSplash } from './lib/img/logos'
import MediaWikiLogo from './lib/img/mediawikiLogo'

export default function Home() {
  return (
    <main className="flex min-h-screen overflow-x-hidden flex-col items-center justify-start align-middle p-16">

      
      {/* Entry Screen */}
      <div style={{minHeight:'600px'}} className='h-screen w-full relative flex flex-col items-center justify-start align-middle'>
        <TitleSplash  />
        <SearchBar prompt="" styles="w-full max-w-2xl h-12 border-black border-6" icon='search-small'  debug /> 
        <div className='w-full max-w-2xl flex flex-row justify-center mt-3 gap-3'>
          <BetaButton/>
          <p className='font-medium text-lg'>Crowd-sourced consumer empowerment.</p>
        </div>
        <div className='absolute flex flex-row items-center justify-center h-32 bottom-12 w-full left-0 right-0 gap-1'>
            <p className='text-xl font-medium'>How it works</p>
            <Icon styles='w-12 h-12 !block' name='down-arrow'/>
        </div>
      </div>

      {/* Term Definitions */}
      <div className=' flex flex-col justify-start items-center w-full -mt-14'>

        {/* Mission Statement */}
        <div className='opacity-0 md:opacity-100 absolute md:relative flex mb-16  max-w-screen-md flex-col text-center w-auto'>
          <IconMark styles='h-12 flex items-center justify-center mr-4 mb-2' isLink={false}/>
          <p style={{lineHeight:'1.35'}} className='inline font-medium text-3xl tracking-tight'><span className='inline whitespace-nowrap'>An open-source platform, empowering employees &</span> <span className='inline whitespace-nowrap'>consumers with <span className='bg-black px-1.5 relative pb-px text-tan'>the truth behind the brands<span className='pl-0'>.</span></span></span></p>
        </div>
        <div className='opacity-100 md:opacity-0 relative md:absolute flex mb-16 max-w-screen-md flex-col text-center w-auto'>
          <IconMark styles='h-12 flex items-center justify-center mr-4 mb-2' isLink={false}/>
          <p style={{lineHeight:'1.35'}} className='inline font-medium text-3xl tracking-tight'><span className='inline whitespace-nowrap'>An open-source platform,</span> <span className='inline whitespace-nowrap'>empowering employees & consumers</span> <span className='inline-block whitespace-nowrap mt-1.5'>with <span className='bg-black px-1.5 relative pb-px text-tan'>the truth behind the brands<span className='pl-0'>.</span></span></span></p> 
        </div>

        {/* Report Types */}
        <Icon styles='h-24 w-24 mb-12 mt-px opacity-30' name='search-document' />
        <TypeExplainer number='3'/>
        <div className='max-w-screen-xl mt-10 lg:mt-8 gap-10 lg:gap-32 w-full flex flex-col lg:flex-row lg:justify-around items-center '>
          <TypeExplainer number='2'/>
          <TypeExplainer number='1'/>
        </div>

        {/* Arrows */}
        <div className='flex flex-row justify-center gap-20 mt-8 lg:mt-2 mb-4 lg:mb-0 max-w-screen-xl w-full lg:px-24'>
          <Icon styles='w-24 p-1 rotate-[90deg] lg:rotate-[45deg]' name='right-arrow' />
          <Icon styles='w-24 p-1 rotate-90 -mt-2 lg:-mt-36' name='right-arrow' />
          <Icon styles='w-24 p-1 rotate-[90deg] lg:rotate-[135deg]' name='right-arrow' />
        </div>

        {/* Reports */}
        <div className='flex flex-row justify-center items-baseline mt-0 lg:-mt-12'>
          <Icon styles='h-24 w-24 pb-1.5 pt-2.5 -mr-5 opacity-60' name='brand-report'/>
          <Icon styles='h-32 w-32' name='brand-report'/>
          <Icon styles='h-24 w-24 pb-1.5 pt-2.5 -ml-5 opacity-60' name='brand-report'/>
        </div>
        <h1 className='font-medium text-3xl'>Reports</h1>
        <p className='font-base text-xl mt-1'>All this crucial journalism,</p>
        <p className='font-base text-xl -mt-1 mb-0.5'>kept in a <span className='font-medium'>permanent, open-source</span> record.</p>

        {/* Brands */}
        <Icon styles='h-24 w-24 mt-9 opacity-30 rotate-90' name='link' />
        <BrandSearchIcon styles='h-32 w-32  -mr-3 mt-9' />
        <h1 className='font-medium text-3xl -mt-2'>Brands</h1>
        <p className='font-base text-xl mt-1'>Get the <span className='font-medium'>sincere truth</span>  about an organization,</p>
        <p className='font-base text-xl -mt-1'>before you buy, donate, or work.</p>

        {/* Contribution Lifecycle */}
        <div className='w-full relative p-4  flex flex-col items-center text-tan mt-16'>
          <div className='bg-black -z-10 absolute top-0 bottom-0 -left-64 -right-64'></div>
          <div className='flex flex-row gap-3 items-center justify-center'>
            <Icon styles='h-14 w-14 -scale-x-100 !block' name='contributors' color='rgb(216 193 172)' />
            <p className='text-2xl font-medium -mt-1'>Created by Contributors</p>
          </div>
          <div className='flex flex-col md:flex-row items-center justify-center mt-8 mb-6'>
            <div className='flex flex-col items-center justify-center pl-2'>
              <Icon styles='h-24 md:h-32 mb-1' name='edit-page' color='rgb(216 193 172)' />
              <p className='lg:text-xl md:text-base text-sm font-medium -mt-1 whitespace-nowrap'>User-Submitted Content</p>
              <p className='text-sm whitespace-nowrap'>Anyone can create and edit brand</p>
              <p className='text-sm whitespace-nowrap'>listings and reports.</p>
            </div>
            <Icon styles='h-16 w-16 rotate-90 md:rotate-0' name='right-arrow' color='rgb(216 193 172)' />
            <div className='flex flex-col items-center justify-center'>
              <Icon styles='h-24 md:h-32 p-1.5 mb-1' name='peer-review' color='rgb(216 193 172)' />
              <p className='lg:text-xl md:text-base text-sm font-medium -mt-1 whitespace-nowrap'>Mandatory Peer-Approval</p>
              <p className='text-sm whitespace-nowrap'>Every submission is reviewed for policy</p>
              <p className='text-sm whitespace-nowrap'>compliance & integrity.</p>
            </div>
            <Icon styles='h-16 w-16 rotate-90 md:rotate-0' name='right-arrow' color='rgb(216 193 172)' />
            <div className='flex flex-col items-center justify-center'>
              <Icon styles='h-24 md:h-32 p-2 mb-1' name='publish' color='rgb(216 193 172)' />
              <p className='lg:text-xl md:text-base text-sm font-medium -mt-1 whitespace-nowrap'>All Published Here</p>
              <p className='text-sm whitespace-nowrap'>Added to brand pages and the search</p>
              <p className='text-sm whitespace-nowrap'>engine, with each citation mirrored.</p>
            </div>
          </div>
          

        </div>


        {/* Questions */}
        <div className='text-center max-w-xl flex flex-col justify-center items-center mt-20'>
          <Icon styles='h-24 w-24 mb-6 opacity-100' name='questions' />

          <h3 className='font-medium text-lg'>What if I (or others) can't afford to choose better brands?</h3>
          <p className='mt-1 text-base'>Corporate price-gouging has crippled affordable local business. This resource should not be used to judge those without a choice. Individual purchasing decisions, especially when coerced, should never take the blame.<br/><br/>Supporting people-first regulations, reforms, and community solutions is much more important.</p>

          <h3 className='mt-14 font-medium text-lg'>' There's no ethical consumption under capitalism anyways. '</h3>
          <p className='mt-1 text-base px-2'>Our mission is to empower people to make informed decisions about who they support and how. Small choices are the first step towards broader awareness and activism.<br/><br/>Underlying change may seem impossible — but corporate PR & the news cycle are designed to make it seem that way.</p>

          <h3 className='mt-14 font-medium text-lg'>Think cancel culture is toxic & unproductive?</h3>
          <p className='mt-1 text-base px-3'>We do too. That’s why reports on individuals will never be allowed on this site. Further, our content policy prohibits reports on ‘political posturing’ and ‘crimes of aesthetic’ — where companies use hot-button issues to stir up buzz. These are marketing tactics.<br/><br/>Reports focus on tangible political impact, like money spent on lobbying or received in subsidies, and never make prescriptive calls to action.</p>
        </div>
        

      </div>
    </main>
  )
}

function TypeExplainer({number}:{number:string}) {
  return (
  <div className={'p-1.5 flex flex-row w-full max-w-md '+REPORT_TYPES[number].color}>
    <Icon styles={'h-16 w-16 ml-1.5 ' + REPORT_TYPES[number].iconStyle} name={REPORT_TYPES[number].icon} color='rgb(216 193 172)'/>
    <div className='text-tan ml-3 pr-5 whitespace-nowrap flex flex-col justify-center items-start'>
      <h1 className='font-medium -mt-px text-2xl -pl-px tracking-[-0.025em]'>{REPORT_TYPES[number].longname}</h1>
      <p className='font-base -mt-1 text-base'>{REPORT_TYPES[number].examples}</p>
    </div>
  </div>);
}

function BetaButton() {
  return (<div className='bg-black text-tan px-1.5 pt-px font-semibold text-base h-7'><p className='relative top-px'>BETA</p></div>);
}
