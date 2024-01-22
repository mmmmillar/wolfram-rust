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
    last_row: Vec<bool>,
    rule_number: u32,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: usize, rule_number: u32) -> Universe {
        utils::set_panic_hook();

        let mut last_row = vec![false; width];
        last_row[(width / 2) as usize] = true;

        Universe {
            width,
            last_row,
            rule_number,
        }
    }

    fn get_rule_index(&self, index: usize) -> usize {
        let left_neighbour = if index == 0 {
            self.width - 1
        } else {
            index - 1
        };
        let right_neighbour = if index == self.width - 1 {
            0
        } else {
            index + 1
        };

        (self.last_row[left_neighbour] as usize) << 2
            | (self.last_row[index] as usize) << 1
            | (self.last_row[right_neighbour] as usize)
    }

    fn is_cell_set(&self, rule_index: usize) -> bool {
        self.rule_number & (1 << rule_index) != 0
    }

    pub fn tick(&mut self) {
        let mut row = vec![false; self.width];

        for i in 0..self.width {
            let rule_index = self.get_rule_index(i);
            row[i] = self.is_cell_set(rule_index);
        }

        self.last_row = row;
    }

    pub fn last_row_ptr(&self) -> *const bool {
        self.last_row.as_slice().as_ptr()
    }

    pub fn set_rule(&mut self, rule_number: u32) {
        self.rule_number = rule_number;
        let mut last_row = vec![false; self.width];
        last_row[(self.width / 2) as usize] = true;
        self.last_row = last_row;
    }
}

#[cfg(test)]
mod tests {
    use crate::Universe;

    #[test]
    fn first_row_set_correctly() {
        let u = Universe::new(11, 90);

        let last_row_ptr = u.last_row_ptr();
        let row_slice = unsafe { std::slice::from_raw_parts(last_row_ptr, u.width) };

        assert_eq!(
            [false, false, false, false, false, true, false, false, false, false, false],
            row_slice
        )
    }

    #[test]
    fn second_row_set_correctly() {
        let mut u = Universe::new(11, 90);
        u.tick();

        let last_row_ptr = u.last_row_ptr();
        let row_slice = unsafe { std::slice::from_raw_parts(last_row_ptr, u.width) };

        assert_eq!(
            [false, false, false, false, true, false, true, false, false, false, false],
            row_slice
        )
    }

    #[test]
    fn third_row_set_correctly() {
        let mut u = Universe::new(11, 90);
        u.tick();
        u.tick();

        let last_row_ptr = u.last_row_ptr();
        let row_slice = unsafe { std::slice::from_raw_parts(last_row_ptr, u.width) };

        assert_eq!(
            [false, false, false, true, false, false, false, true, false, false, false],
            row_slice
        )
    }

    #[test]
    fn get_rule_index() {
        let u = Universe::new(7, 94); // [false, false, false, true, false, false, false]

        assert_eq!(0, u.get_rule_index(0)); // [false, false, false]
        assert_eq!(0, u.get_rule_index(1)); // [false, false, false]
        assert_eq!(1, u.get_rule_index(2)); // [false, false, true]
        assert_eq!(2, u.get_rule_index(3)); // [false, true, false]
        assert_eq!(4, u.get_rule_index(4)); // [true, false, false]
        assert_eq!(0, u.get_rule_index(5)); // [false, false, false]
        assert_eq!(0, u.get_rule_index(6)); // [false, false, false]
    }

    #[test]
    fn is_cell_set() {
        let u = Universe::new(7, 94);

        assert_eq!(false, u.is_cell_set(u.get_rule_index(0)));
        assert_eq!(false, u.is_cell_set(u.get_rule_index(1)));
        assert_eq!(true, u.is_cell_set(u.get_rule_index(2)));
        assert_eq!(true, u.is_cell_set(u.get_rule_index(3)));
        assert_eq!(true, u.is_cell_set(u.get_rule_index(4)));
        assert_eq!(false, u.is_cell_set(u.get_rule_index(5)));
        assert_eq!(false, u.is_cell_set(u.get_rule_index(6)));
    }
}
