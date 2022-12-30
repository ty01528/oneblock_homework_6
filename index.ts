import { ApiPromise,WsProvider,Keyring} from "@polkadot/api";
import { IKeyringPair} from "@polkadot/types/types";
import { metadata} from "@polkadot/types/interfaces/essentials";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve,ms))

const WEB_SOCKET = "ws://localhost:9944";

const connectSubstrate = async () => {
    const wsProvider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({ provider:wsProvider});
    await api.isReady;
    console.log("connection to substrate is OK.");
    return api;
}

const subscribeAliceBalance = async (api: ApiPromise)=> {
    const keyring = new Keyring({type:'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    await api.query.system.account(alice.address, (aliceAcct: { data: { free: any; }; }) => {
        console.log("Subscribe to Alice account.")
        const aliceFreeSub = aliceAcct.data.free;
        console.log(`Alice Account (sub): ${aliceFreeSub}`);
    })
}
const index = async () => {
  const api = await connectSubstrate();
  await subscribeAliceBalance(api);
  await sleep(600000)
  console.log('Over!')
}

index().then(()=>{
    console.log("successfully exit");
    process.exit(0);
}).catch(()=>{
    console.log("error occurred");
})