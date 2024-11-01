declare global {
	function describe(name: string, fn: () => void): void;
	function test(name: string, fn: () => void): void;
	function it(name: string, fn: () => void): void;
	function expect(value: any): any;
}

export {};
