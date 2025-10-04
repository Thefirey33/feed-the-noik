import "../App.css"

export function UpToolbar() {
    return (
        <>
            <div className="p-3 m-2 bg-black text-white font-[TerminusTTF] text-xl border-2 rounded-xl border-yellow-300">

                <div className="flex flex-row items-center">
                    <img src="/favicon.ico" alt="the noik." className="mr-5" width={50}/>
                    <h1 className="text-xl font-scaling transition-all">Feed The Noik</h1>
                </div>
            </div>
        </>
    );
}