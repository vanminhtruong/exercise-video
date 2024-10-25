interface IBox {
    moveTo(top: number, left: number): Promise<void>;
    getHeight(): number;
    getWidth(): number;
}

interface IAnimator {
    animate(): void;
}

class Box implements IBox {
    private element: HTMLElement;

    constructor(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with ID "${elementId}" not found.`);
        }
        this.element = element;
    }

    public moveTo(top: number, left: number): Promise<void> {
        return new Promise((resolve) => {
            this.element.style.top = `${top}px`;
            this.element.style.left = `${left}px`;

            this.element.addEventListener('transitionend', () => resolve(), { once: true });
        });
    }

    public getHeight(): number {
        return this.element.clientHeight;
    }

    public getWidth(): number {
        return this.element.clientWidth;
    }
}

class BoxAnimator implements IAnimator {
    private box: IBox;
    private delay: number;

    constructor(box: IBox, delay: number = 2000) {
        this.box = box;
        this.delay = delay;
    }

    public async animate(): Promise<void> {
        const windowHeight = window.innerHeight - this.box.getHeight();
        const windowWidth = window.innerWidth - this.box.getWidth();

        await this.box.moveTo(0, windowWidth); // Sang góc trên bên phải
        await this.delayAnimation();

        await this.box.moveTo(windowHeight, windowWidth); // Sang góc dưới bên phải
        await this.delayAnimation();

        await this.box.moveTo(windowHeight, 0); // Sang góc dưới bên trái
        await this.delayAnimation();

        await this.box.moveTo(0, 0); // Sang góc trên bên trái
    }

    private delayAnimation(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, this.delay));
    }
}

// Khởi tạo box và animator
const box = new Box('box');
const animator = new BoxAnimator(box);
animator.animate();
