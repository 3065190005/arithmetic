const {ccclass, property} = cc._decorator;

import Character from "./character";

@ccclass
export default class PhyBoxTarget extends cc.Component {
    
    private body:Character;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }
}
