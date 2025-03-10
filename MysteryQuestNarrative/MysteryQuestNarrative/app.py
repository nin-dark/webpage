import os
from flask import Flask, render_template, session, redirect, url_for, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Puzzle solutions
PUZZLE_SOLUTIONS = {
    'puzzle1': 'BIRTHDAY',
    'puzzle2': '15/03',
    'puzzle3': 'BHOOMI'
}

@app.route('/')
def landing():
    # Initialize session
    session['progress'] = session.get('progress', 0)
    session['score'] = session.get('score', 0)
    return render_template('landing.html')

@app.route('/puzzle1')
def puzzle1():
    if session.get('progress', 0) >= 0:
        return render_template('puzzle1.html')
    return redirect(url_for('landing'))

@app.route('/puzzle2')
def puzzle2():
    if session.get('progress', 0) >= 1:
        return render_template('puzzle2.html')
    return redirect(url_for('puzzle1'))

@app.route('/puzzle3')
def puzzle3():
    if session.get('progress', 0) >= 2:
        return render_template('puzzle3.html')
    return redirect(url_for('puzzle2'))

@app.route('/finale')
def finale():
    if session.get('progress', 0) >= 3:
        session['progress'] = 4  # Increment progress for cake page
        return render_template('finale.html')
    return redirect(url_for('puzzle3'))

@app.route('/cake')
def cake():
    if session.get('progress', 0) >= 4:
        session['progress'] = 5  # Increment progress for letter page
        return render_template('cake_new.html')
    return redirect(url_for('finale'))

@app.route('/letter')
def letter():
    if session.get('progress', 0) >= 5:
        return render_template('letter.html')
    return redirect(url_for('cake'))

@app.route('/check_solution', methods=['POST'])
def check_solution():
    data = request.get_json()
    puzzle_id = data.get('puzzle_id')
    solution = data.get('solution', '').upper()

    logger.debug(f"Checking solution for puzzle {puzzle_id}: {solution}")

    if puzzle_id in PUZZLE_SOLUTIONS and solution == PUZZLE_SOLUTIONS[puzzle_id]:
        session['progress'] = session.get('progress', 0) + 1
        session['score'] = session.get('score', 0) + 100
        logger.debug(f"Correct solution! Progress: {session['progress']}, Score: {session['score']}")
        return jsonify({'success': True})

    logger.debug(f"Incorrect solution for puzzle {puzzle_id}")
    return jsonify({'success': False})

@app.route('/skip_puzzle', methods=['POST'])
def skip_puzzle():
    current_progress = session.get('progress', 0)
    session['progress'] = current_progress + 1
    logger.debug(f"Skipping puzzle. New progress: {session['progress']}")
    return jsonify({'success': True})