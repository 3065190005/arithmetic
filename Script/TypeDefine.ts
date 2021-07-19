export namespace CUSDefine {
	export enum State{
		None,
		Idle,
		Move,
		Attack,
		Hurt,
		Dead,
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