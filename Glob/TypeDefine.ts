export namespace CUSDefine {
	export enum State{
		None,
		Idle,
		Move,
		Attack,
		Hurt,
		Dead,
	};

	export enum AiType{
		None,
		Normal,
		KeeyAway,
		AlwaysAtt,
		FastRound,
	}

	export interface AttEvent{
		attNode:any,
		hitNode:any,
		damage:number,
		hitback:any,
		hitLev:number
	};

	export let StatusVec:Map<string,State> = new Map([
		["None",State.None],
		["Idle",State.Idle],
		["Move",State.Move],
		["Attack",State.Attack],
		["Hurt",State.Hurt],
		["Dead",State.Dead]
	]);
};