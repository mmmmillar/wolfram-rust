mod utils;

use wasm_bindgen::prelude::*;

extern crate js_sys;
extern crate web_sys;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub struct Universe {
    width: usize,
    depth: usize,
    cells: Vec<bool>,
    rows: usize,
    rule: Vec<u32>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: usize, depth: usize, rule_number: usize) -> Universe {
        utils::set_panic_hook();

        let mut cells = Vec::new();

        let mut row = vec![false; width];
        row[(width / 2) as usize] = true;
        cells.extend_from_slice(&row);

        Universe {
            width,
            depth,
            cells,
            rows: 1,
            rule: Self::set_rule(rule_number),
        }
    }

    fn set_rule(rule_num: usize) -> Vec<u32> {
        let mut rule_num_base_2 = format!("{:b}", rule_num);
        let num_zeros = 8 - rule_num_base_2.len();

        if num_zeros > 0 {
            rule_num_base_2 = "0".repeat(num_zeros) + &rule_num_base_2;
        }

        rule_num_base_2
            .chars()
            .filter_map(|c| c.to_digit(10))
            .collect()
    }

    fn get_next_row(&self, cells: &Vec<bool>) -> Vec<bool> {
        let offset = self.width * self.rows - self.width;

        eprintln!("rows: {:?}", self.rows);
        eprintln!("cells pre update: {:?}", cells);

        let mut row = vec![false; self.width];

        for i in 0..self.width {
            let j = i + offset;
            let mut neigbourhood = String::with_capacity(3);

            let left_index = if j as i32 - 1 < offset as i32 {
                j
            } else {
                j - 1
            };
            eprintln!("left_index: {:?}", left_index);
            match cells[left_index] {
                true => neigbourhood.push('1'),
                false => neigbourhood.push('0'),
            };

            eprintln!("j: {:?}", j);
            match cells[j] {
                true => neigbourhood.push('1'),
                false => neigbourhood.push('0'),
            };

            let right_index = if j + 1 >= cells.len() { j } else { j + 1 };
            eprintln!("right_index: {:?}", right_index);
            match cells[right_index] {
                true => neigbourhood.push('1'),
                false => neigbourhood.push('0'),
            };

            let rule_index = 7 - usize::from_str_radix(&neigbourhood, 2).unwrap();
            eprintln!(
                "neighbourhood: {:?}, rule_index: {:?}, result: {:?}",
                neigbourhood,
                rule_index,
                self.rule[rule_index] != 0
            );

            row[i] = self.rule[rule_index] != 0;
        }

        row
    }

    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        if self.rows == self.depth {
            next.drain(0..self.width);
            self.rows -= 1;
        }

        let new_row = self.get_next_row(&next);

        next.extend_from_slice(&new_row);
        self.rows += 1;

        self.cells = next;
        eprintln!("cells post update: {:?}", self.cells);
    }

    pub fn cell_ptr(&self) -> *const bool {
        self.cells.as_slice().as_ptr()
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.depth
    }

    pub fn rows(&self) -> usize {
        self.rows
    }

    pub fn rule_str(&self) -> String {
        self.rule.iter().map(|c| c.to_string()).collect()
    }
}
