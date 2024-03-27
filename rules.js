/**
 * @type {Array<{ description: string, blockingRules: number[], requiredRules: number[], addtionalInfo: null | string }>}
 */
const rules = [
    {
        description: `Jeżeli zostały graczowi dwie karty, zmuszony jest wypowiedzenie słowa "immunitet" po położeniu lub przed. Za nie powiedzenie tego gracz dobiera 4 karty.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: 'W przypadku "Easy ROTeD" dobiera się 2 karty',
    },
    {
        description: `Można wyrzucać kilka kart tej samej liczby.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `As powoduje zmianę kierunku.`,
        blockingRules: [3],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `As powoduje zmianę koloru (czerwo/dzwonek/wino/żołędź).`,
        blockingRules: [2, 12],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Joker powoduje położenie jednocześnie maksymalnie 3 kart zależnych od koloru Jokera - czerwony Joker powoduje możliwość położenia dowolnej karty w kolorze czerwa i dzwonka, a czarny - wina i żołędzia. Kładzenie jednocześnie kart oznacza, że te karty nie mają możliwości wykonania funkcji.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: `Analogicznie inny Joker powoduje wyrzucenie dowolnych kart`,
    },
    {
        description: `Czarny Walet (wino (♠️) i żołędź (♣️)) są żądaniami kart; można kłaść każdą kartę od 2 do 9, ale nie mogą wykonywać funkcji.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Można przebijać żądania czarnego Waleta (wino/żołędź) każdym Waletem (czerwo/dzwonek/wino/żołędź)`,
        blockingRules: [],
        requiredRules: [5],
        addtionalInfo: null,
    },
    {
        description: `Czwórka jest <u>wymuszonym dobraniem jednej karty</u> dla następnego gracza i nie powoduje jego blokady. Jeżeli jest włączona zasada nr. 2, można maksymalnie położyć parę kart (czyli dwie) - powoduje to <u>wymuszone dobranie aż trzech kart</u>.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Dwójka i trójka powodują dobranie kart według ich wartości. Można je przebijać równą lub wyższą co do wartości kartą (czyli do Trójki); jeżeli jest to wyższa, musi być odpowiednia do koloru.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Przestaje funkcjonować w zasadzie nr. 9 potrzeba położenia wyższej karty do koloru.`,
        blockingRules: [8],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Przez całą rundę nie można zadawać pytań; za każde pytanie gracz dobiera jedną kartę.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Wyrzucenie najpierw Czwórek, a później Jokera tworzy <i>combo</i> - daje reszcie graczy po karcie i pozwala na wyrzucenie tylu dowolnych kart, ile zostało wyrzuconych Czwórek; ostatnia wyrzucona karta może wykonać funkcję, jeżeli posiada.`,
        blockingRules: [],
        requiredRules: [1, 4, 7],
        addtionalInfo: null,
    },
    {
        description: `Na Asa możesz kłaść dowolną kartę.`,
        blockingRules: [],
        requiredRules: [2],
        addtionalInfo: null,
    },
    {
        description: `Szóstka jest "mydełkiem", możesz kłaść kiedy chcesz i na nią co chcesz.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Czarna dziewiątka jest <u>wymuszoną</u> blokadą przeciwnika i dobraniem jednej karty. Jest niezależna od zasady nr. 2 i niemożliwe jest wyłożenie kilku kart naraz.`,
        blockingRules: [],
        requiredRules: [],
        addtionalInfo: null,
    },
    {
        description: `Dziewiąta wino (♠️) działa dla gracza <u>poprzedniego</u>.`,
        blockingRules: [],
        requiredRules: [15],
        addtionalInfo: null,
    },
    {
        description: `W dziewiątce tylko dobranie jest wymuszone, a blokady się kumulują. Jeżeli następna osoba (lub poprzednia z  nie będzie miała dziewiątki, czeka tyle kolejek, ile dziewiątek pod rząd.`,
        blockingRules: [],
        requiredRules: [15],
        addtionalInfo: null,
    },
    {
        description: `Król to tarcza, która chroni przed brakiem wypowiedzenia “immunitet”. Jeżeli ktoś zauważy brak wypowiedzenia przez wytyczoną osobę, ten grać może przerwać wykonującemu w celu postawieniu króla, odpowiedniego do ostatniej karty. Osoba wytyczająca (ta, która zauważyła brak wypowiedzenia), <u>musi</u> wziąć z talii dwie karty.`,
        blockingRules: [20],
        requiredRules: [0],
        addtionalInfo: null,
    },
    {
        description: `Dama tego samego koloru może zablokować króla. Osoba, która użyła króla, musi wziąć z talii 5 kart.`,
        blockingRules: [],
        requiredRules: [18],
        addtionalInfo: 'W przypadku "Easy ROTeD" dobiera się 4 karty',
    },
    {
        description: `Król powoduje dobranie czterech kart, dama tego samego koloru przebija dla wcześniejszego gracza.`,
        blockingRules: [18],
        requiredRules: [],
        addtionalInfo: "W zasadzie nr. 9 jest wyższa od trójki",
    },
]
