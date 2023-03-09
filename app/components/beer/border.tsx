type BeerBorderProps = {
    upperColor: string
    bottomColor: string
    className: string
}

export function BeerBorder({ upperColor, bottomColor, className }: BeerBorderProps) {
    return (
        <svg className={className} viewBox="0 0 1000 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <rect fill={upperColor} x="0" y="0" width="1000" height="50" ></rect>
            <path fill={bottomColor} strokeLinecap="round" strokeLinejoin="miter" d="M0 32L11.8 29.2C23.7 26.3 47.3 20.7 71.2 20.3C95 20 119 25 142.8 25.8C166.7 26.7 190.3 23.3 214.2 23.5C238 23.7 262 27.3 285.8 32C309.7 36.7 333.3 42.3 357.2 40.5C381 38.7 405 29.3 428.8 26.5C452.7 23.7 476.3 27.3 500 28.3C523.7 29.3 547.3 27.7 571.2 29.8C595 32 619 38 642.8 36.8C666.7 35.7 690.3 27.3 714.2 23.3C738 19.3 762 19.7 785.8 20.8C809.7 22 833.3 24 857.2 27C881 30 905 34 928.8 36.7C952.7 39.3 976.3 40.7 988.2 41.3L1000 42L1000 51L988.2 51C976.3 51 952.7 51 928.8 51C905 51 881 51 857.2 51C833.3 51 809.7 51 785.8 51C762 51 738 51 714.2 51C690.3 51 666.7 51 642.8 51C619 51 595 51 571.2 51C547.3 51 523.7 51 500 51C476.3 51 452.7 51 428.8 51C405 51 381 51 357.2 51C333.3 51 309.7 51 285.8 51C262 51 238 51 214.2 51C190.3 51 166.7 51 142.8 51C119 51 95 51 71.2 51C47.3 51 23.7 51 11.8 51L0 51Z"></path>
        </svg>
    )
}