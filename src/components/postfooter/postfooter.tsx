import { getTranslations } from "next-intl/server"

const Postfooter = async () => {
    const t = await getTranslations()
    return (
        <div className="bg-[#1C355E] border-t border-white/5 py-6">
            <div className="container-cs px-4">
                <p className="text-center text-white">
                    &copy; 2025 {t("Barcha huquqlar himoyalangan")}.
                </p>
            </div>
        </div>
    )
}

export default Postfooter
