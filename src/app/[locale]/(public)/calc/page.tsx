'use client'

import { Calculator, RefreshCw } from 'lucide-react'
import { useState } from 'react'

const Page = () => {
    const [inputs, setInputs] = useState({
        bxValue: '412000',
        x6: '',
        x10: '',
        xa: '',
        xt: '',
        xy: '',
        k1: '',
        k0: '',
        kz: '',
        kzh: '',
    })

    const [result, setResult] = useState<number | null>(null)

    const handleInputChange = (field: string, value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setInputs((prev) => ({ ...prev, [field]: value }))
            setResult(null)
        }
    }

    const calculateResult = () => {
        const values = {
            bx: parseFloat(inputs.bxValue) || 0,
            x6: parseFloat(inputs.x6) || 0,
            x10: parseFloat(inputs.x10) || 0,
            xa: parseFloat(inputs.xa) || 0,
            xt: parseFloat(inputs.xt) || 0,
            xy: parseFloat(inputs.xy) || 0,
            k1: parseFloat(inputs.k1) || 0,
            k0: parseFloat(inputs.k0) || 0,
            kz: parseFloat(inputs.kz) || 0,
            kzh: parseFloat(inputs.kzh) || 0,
        }

        const sumPositive = values.x6 + values.x10
        const sumNegative = values.xa + values.xt + values.xy
        const difference = sumPositive - sumNegative

        const calculatedResult =
            values.bx *
            difference *
            values.k1 *
            values.k0 *
            values.kz *
            values.kzh

        setResult(calculatedResult)
    }

    const resetForm = () => {
        setInputs({
            bxValue: '412000',
            x6: '',
            x10: '',
            xa: '',
            xt: '',
            xy: '',
            k1: '',
            k0: '',
            kz: '',
            kzh: '',
        })
        setResult(null)
    }

    const fields = [
        {
            key: 'bxValue',
            label: 'Bazaviy hisoblash miqdori (BHM)',
            desc: 'BHM miqdorini kiriting (so\'m)',
        },
        {
            key: 'x6',
            label: 'Binoning umumiy hajmi',
            desc: 'Bino hajmini kiriting (kub metr)',
        },
        {
            key: 'x10',
            label: "Ruxsat etilgan qavatlar sonidan yuqori bo'lgan bino hajmi",
            desc: "Qo'shimcha qavatlar hajmini kiriting",
        },
        {
            key: 'xa',
            label: 'Avtoturargox qismi umumiy hajmi',
            desc: 'Avtoturargox maydonini kiriting',
        },
        {
            key: 'xt',
            label: 'Texnik qavatlar, inshoatlar va xonalar qismi umumiy hajmi',
            desc: 'Texnik xonalar hajmini kiriting',
        },
        {
            key: 'xy',
            label: 'Turar joy binosining umumiy foydalanishdagi qismi umumiy hajmi',
            desc: 'Umumiy foydalanish maydonini kiriting',
        },
        {
            key: 'k1',
            label: 'Qurilish turi koeffitsienti',
            desc: "Qurilish turi bo'yicha koeffitsient",
        },
        {
            key: 'k0',
            label: 'Obekt turi koeffitsienti',
            desc: "Obekt turi bo'yicha koeffitsient",
        },
        {
            key: 'kz',
            label: 'Hududiy zonalar koeffitsienti',
            desc: "Hudud bo'yicha koeffitsient",
        },
        {
            key: 'kzh',
            label: 'Obekt joylashuvi koeffitsienti',
            desc: "Joylashuv bo'yicha koeffitsient",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-3 rounded-xl">
                            <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Muhandislik-Kommunikatsiya Kalkulyator
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base mt-1">
                                Transport infratuzilmasini yaratish
                                xarajatlarini hisoblash
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Ma'lumotlarni kiriting
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {field.label}
                                </label>
                                <input
                                    type="text"
                                    value={
                                        inputs[field.key as keyof typeof inputs]
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            field.key,
                                            e.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg"
                                />
                                <p className="text-xs text-gray-500">
                                    {field.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                            onClick={calculateResult}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Hisoblash
                        </button>
                        <button
                            onClick={resetForm}
                            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Tozalash
                        </button>
                    </div>
                </div>

                {result !== null && (
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white animate-fade-in">
                        <h3 className="text-lg font-semibold mb-2 opacity-90">
                            Hisoblangan to'lov miqdori
                        </h3>
                        <div className="text-4xl md:text-5xl font-bold mb-2">
                            {result.toLocaleString('uz-UZ', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{' '}
                            so'm
                        </div>
                        <p className="text-sm opacity-90">
                            Muhandislik-kommunikatsiya tarmoqlari va transport
                            infratuzilmasini yaratish xarajatlari
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Page
