// Counter Store - manages global counter state
const counterStore = createStore('counter', 
    { 
        count: 0,
        step: 1 
    }, 
    {
        increment: (get, set) => {
            set({ count: get().count + get().step });
        },
        decrement: (get, set) => {
            set({ count: get().count - get().step });
        },
        reset: (get, set) => {
            set({ count: 0 });
        },
        setStep: (get, set, newStep) => {
            set({ step: newStep });
        }
    }
);