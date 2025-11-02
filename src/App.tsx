import './App.css';
import { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { madoiKey, madoiUrl } from './keys';
import { Madoi } from 'madoi-client';
import { useSharedModel } from 'madoi-client-react';
import { getLastPath } from './util/Util';
import { LocalJsonStorage } from './util/LocalJsonStorage';
import { VirtualRoom } from './components/virtualroom/VirtualRoom';
import { VirtualRoomOwnModel } from './components/virtualroom/model/VirtualRoomOwnModel';
import { VirtualRoomModel } from './components/virtualroom/model/VirtualRoomModel';

const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsakydfsfjo4`;
const ls = new LocalJsonStorage<{id: string, background: string}>(`presence-${roomId}`);
export const AppContext = createContext({
    storage: ls,
    madoi: new Madoi(
//      `ws://localhost:8080/madoi/rooms/${roomId}`,
        `${madoiUrl}/${roomId}`,
        madoiKey,
        {id: ls.get("id", () => uuidv4()), profile: {}}
    )
});

export default function App() {
    const app = useContext(AppContext);

    const vrom = useSharedModel(app.madoi, ()=>new VirtualRoomOwnModel(
        roomId, "匿名", [Math.random() * 100, Math.random() * 100]));
    const vrm = useSharedModel(app.madoi, ()=>new VirtualRoomModel(
        roomId, "defaultBackground.png"));

    return <VirtualRoom vrm={vrm} vrom={vrom} />;
}
