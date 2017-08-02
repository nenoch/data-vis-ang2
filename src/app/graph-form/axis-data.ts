export class AxisData {
    constructor(
        public xColumn: string,
        public yColumn: string
    ) {}

    // For the time being, this only checks the x and y columns
    public isEmpty(): boolean {
        return (!this.xColumn || !this.yColumn) ? true : false;
    }
};
