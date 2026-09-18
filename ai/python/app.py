from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "application": "Taana-Baana AI Service",
        "status": "running",
        "message": "From Hands to Markets."
    })


@app.route("/api/catalog", methods=["POST"])
def generate_catalog():

    data = request.get_json() or {}

    name = data.get(
        "name",
        "Handcrafted Product"
    )

    material = data.get(
        "material",
        "natural materials"
    )

    category = data.get(
        "category",
        "handicraft"
    )


    result = {

        "title":
            name.title(),

        "category":
            category,

        "material":
            material,

        "description":
            (
                f"A beautifully handcrafted {name.lower()} "
                f"made using {material}. "
                f"Created using traditional artisan techniques, "
                f"this piece carries the character of handmade "
                f"Indian craftsmanship."
            ),

        "keywords": [
            "handmade",
            "Indian craft",
            category,
            material,
            "artisan",
            "traditional craft"
        ],

        "languages": [
            "English",
            "Hindi"
        ],

        "status":
            "AI catalog generated"

    }


    return jsonify(result)


@app.route("/api/pricing", methods=["POST"])
def calculate_price():

    data = request.get_json() or {}


    material = float(
        data.get(
            "materialCost",
            0
        )
    )


    labour = float(
        data.get(
            "labourCost",
            0
        )
    )


    packaging = float(
        data.get(
            "packagingCost",
            0
        )
    )


    other = float(
        data.get(
            "otherCost",
            0
        )
    )


    base_cost = (
        material +
        labour +
        packaging +
        other
    )


    minimum = round(
        base_cost * 1.20
    )


    recommended = round(
        base_cost * 1.50
    )


    premium = round(
        base_cost * 1.80
    )


    return jsonify({

        "baseCost":
            base_cost,

        "minimumPrice":
            minimum,

        "recommendedPrice":
            recommended,

        "premiumPrice":
            premium,

        "explanation":
            (
                "Prices are calculated using the "
                "provided cost structure and a "
                "sustainable margin."
            )

    })


@app.route("/api/match", methods=["POST"])
def match_buyers():

    data = request.get_json() or {}

    requirement = data.get(
        "requirement",
        ""
    )


    matches = [

        {
            "name":
                "Artisan Cluster — West Bengal",

            "makers":
                42,

            "score":
                94,

            "reason":
                "Craft category and quantity match"
        },

        {
            "name":
                "Craft Cooperative — Odisha",

            "makers":
                27,

            "score":
                88,

            "reason":
                "Product and budget compatibility"
        }

    ]


    return jsonify({

        "requirement":
            requirement,

        "matches":
            matches

    })


@app.route("/api/business-advisor", methods=["POST"])
def business_advisor():

    data = request.get_json() or {}

    message = data.get(
        "message",
        ""
    )


    response = (
        "Taana-Baana AI can help you with "
        "product cataloging, pricing, buyer "
        "matching and digital market preparation."
    )


    if "price" in message.lower():

        response = (
            "Start by calculating raw materials, "
            "labour, packaging and other costs. "
            "Then add a sustainable margin."
        )


    elif "catalog" in message.lower():

        response = (
            "Tell me your product name, materials, "
            "how it is made and what makes it special. "
            "I can turn that into a professional listing."
        )


    elif "buyer" in message.lower():

        response = (
            "Describe your buyer requirement, quantity "
            "and budget. The matching system can identify "
            "potential artisan clusters."
        )


    return jsonify({

        "message":
            response

    })


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )