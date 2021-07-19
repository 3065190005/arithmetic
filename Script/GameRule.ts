class GameRule{
	private constructor(){
		this.InitOnFile();
	}

	private static m_Instance : GameRule = null!;

	public static GetInstance(): GameRule{
		if(!this.m_Instance){
			this.m_Instance = new GameRule();
		}
		return this.m_Instance;
	}

	public InitOnFile():void{

	}

	public SetPlayerName(_name:string) :void{
		this.playerName = _name;
	}

	public GetPlayerName():string{
		return this.playerName;
	}

	public SetPlayerLevel(_level:number):void{
		this.playerLevel = _level;
	}

	public GetPlayerLevel():number{
		return this.playerLevel;
	}
	
	private playerName:string = "";
	private playerLevel:number = 0;
};