"use server";

import { PotentialBrandPageList } from "./actions";




export default async function Page({ params }: { params: {} }) {

    return (
        <PotentialBrandPageList />
    );
}