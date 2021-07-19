namespace Singleton {
	class GameRule{
		private constructor(){
			this.initOnFile();
		}

		private static m_Instance : GameRule = null!;

		public static getInstance(): GameRule{
			if(!this.m_Instance){
				this.m_Instance = new GameRule();
			}
			return this.m_Instance;
		}

		public initOnFile():void{

		}

		set setPlayerName(_name:string)
			{this.m_playerName = _name;}

		get getPlayerName():string
			{return this.m_playerName;}

		set setPlayerLevel(_level:number)
			{this.m_playerLevel = _level;}

		get getPlayerLevel():number
			{return this.m_playerLevel;}
		
		private m_playerName:string;
		private m_playerLevel:number;
	};
};