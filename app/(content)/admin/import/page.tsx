"use server";

import { PotentialBrandPageList } from "./components";




export default async function Page({ params }: { params: {} }) {

    return (
        <PotentialBrandPageList />
    );
}